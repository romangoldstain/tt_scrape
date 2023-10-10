#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'
import TiktokDiscovery from "tiktok-discovery-api"
import axios from 'axios'
import { JSDOM } from "jsdom"

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
                    await retrieveTrendingHashtag(argv['country-code'], argv['page'], argv['limit'], argv['period'])
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
                    await retrieveHashtagVideos(argv['hashtag'], argv['country-code'], argv['period'])
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
    const trending = await TiktokDiscovery.getTrendingHastag(countryCode, page, limit, period)
    console.log(JSON.stringify(trending))
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

    const result = {
        hashtag,
        countryCode,
        videos
    }
    console.log(JSON.stringify(result))
}



