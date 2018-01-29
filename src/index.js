#!/usr/bin/env node
import inquirer from 'inquirer'
import chalk from 'chalk'
import Parser from 'rss-parser'
import moment from 'moment'

const parser = new Parser()

const getFeed = async () => {
  try {
    return await parser.parseURL('https://hnrss.org/frontpage')
  } catch (e) {
    console.log(e)
    return Promise.error(e)
  }
}

function logArticle(item) {
  console.log(`${chalk.white(moment(item.pubDate).format('MM-DD hh:mma'))} - ${chalk.cyan(item.title)}
${item.link}
`)
}

async function throttleWithPrompt(articles) {
  console.log(`
--------------------------------------------`)
  try {
    articles.slice(0, 6).forEach(logArticle)
    const articlesLeft = articles.slice(10)

    if (articlesLeft.length) {
      const { cont } = await inquirer.prompt({
        type: 'confirm',
        name: 'cont',
        message: 'See more?',
        when: articlesLeft.length,
      })

      if (cont) {
        return throttleWithPrompt(articlesLeft)
      }
    }

    return true
  } catch (e) {
    console.log(e)
    return Promise.reject(e)
  }
}

getFeed()
  .then((res) => {
    throttleWithPrompt(res.items)
  })
  .catch(console.log)
