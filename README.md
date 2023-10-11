## [WIP] TikTok Trends Scrapper


Execution instruction and relevant arguments:

```node index.js --help```

The output will be placed under `out` dir in JSON file with the following naming format: {command_name}_{epoch_timestamp}.


### Execution examples: 

Top 20 (default) hashtags for period of 7 (default) days in Israel: 

```node index.js hashtags IL```

Top 50 hashtags for period of 30 days in Israel: 

```node index.js hashtags IL 30 1 50 ```

Top 50 videos for hashtag 'israel' in Israel in last 7 days (default): 

```node index.js videos israel IL```


#### Outputs:

[An output example for trending hashtag](json/hashtags.json)

[An output example for trending videos for specific hashtag](json/videos.json)
