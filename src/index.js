#!/usr/bin/env node
import chalk from 'chalk'
import Parser from 'rss-parser'

const parser = new Parser()

const getFeed = async () => {
  try {
    return await parser.parseURL('https://hnrss.org/frontpage')
  } catch (e) {
    console.log(e)
    return Promise.error(e)
  }
}

getFeed()
  .then((res) => {
    res.items.forEach((item) => {
      console.log(`${chalk.cyan(item.title)}
${item.link}
${chalk.white(item.pubDate)}
`)
    })
  })
