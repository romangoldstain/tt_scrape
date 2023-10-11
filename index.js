#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'
import TiktokDiscovery from "tiktok-discovery-api"
import axios from 'axios'
import { JSDOM } from "jsdom"
import fs from 'fs'

const main = async () => {
    const args = hideBin(process.argv)
    return yargs(args)
        .command(
            'hashtags [country-code] [period] [page] [limit]',
            'Retrieve hashtag trends',
            yargs => {
                return yargs
                    .positional('country-code', {
                        describe: 'The code of the target country',
                        type: 'string',
                    })
                    .positional('period', {
                        describe: 'time period, in days [7, 30, 120]',
                        type: 'number',
                        default: 7
                    })
                    .option('page', {
                        describe: 'Number of pages',
                        type: 'number',
                        default: 1,
                    })
                    .option('limit', {
                        describe: 'Limit per page',
                        type: 'number',
                        default: 20,
                    })
                    .demandOption('country-code')
            },
            async argv => {
                try {
                    const data = await retrieveTrendingHashtag(argv['country-code'], argv['page'], argv['limit'], argv['period'])
                    writeToFile(data, 'hashtags')
                }
                catch (e) {
                    console.error('Something went wrong :(', e)
                }
            },
        )
        .command(
            'videos [hashtag] [country-code] [period]',
            'Retrieve hashtag trends',
            yargs => {
                return yargs
                    .positional('hashtag', {
                        describe: 'The hashtag target',
                        type: 'string',
                    })
                    .positional('country-code', {
                        describe: 'The code of the target country',
                        type: 'string',
                    })
                    .positional('period', {
                        describe: 'time period, in days [7, 30, 120]',
                        type: 'number',
                        default: 7
                    })
                    .demandOption('country-code')
            },
            async argv => {
                try {
                    const data = await retrieveHashtagVideos(argv['hashtag'], argv['country-code'], argv['period'])
                    writeToFile(data, 'videos')
                }
                catch (e) {
                    console.error('Something went wrong :(', e)
                }
            },
        )
        .demandCommand(1)
        .parse()
}


main().catch(e => console.error(e))


async function retrieveTrendingHashtag(countryCode, page, limit, period) {
    return await TiktokDiscovery.getTrendingHastag(countryCode, page, limit, period)
}

async function retrieveHashtagVideos(hashtag, countryCode, period) {
    const res = await axios.get(`https://ads.tiktok.com/business/creativecenter/hashtag/${hashtag}/pc/en?countryCode=${countryCode}&period=${period}`)
    const dom = new JSDOM(res.data)
    const videos = Array.prototype.slice.call(dom.window.document.querySelectorAll('iframe')).map(f => {
        return {
            id: f.getAttribute('title'),
            url: f.getAttribute('src')
        }
    })

    return {
        hashtag,
        countryCode,
        videos
    }
}

async function writeToFile(data, tag) {
    const now = Date.now()
    if (!fs.existsSync('out')) {
        fs.mkdirSync('out')
    }
    fs.writeFileSync(`out/${tag}_${now}.json`, JSON.stringify(data))
}

