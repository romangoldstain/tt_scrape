
import TiktokDiscovery from "tiktok-discovery-api"

const main = async () => {
    const trending = await TiktokDiscovery.getTrendingHastag("IL", 1, 3, 7)
    console.log(JSON.stringify(trending))
    // console.log(trending)
}


main().catch(e => console.error(e))
