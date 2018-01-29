#!/usr/bin/env node
import inquirer from 'inquirer'
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

function logArticle(item) {
  console.log(`${chalk.cyan(item.title)}
${item.link}
${chalk.white(item.pubDate)}`)
}

async function throttleWithPrompt(articles) {
  try {
    articles.slice(0, 10).forEach(logArticle)
    const articlesLeft = articles.slice(10)

    const { cont } = await inquirer.prompt({
      type: 'confirm',
      name: 'cont',
      message: 'See more?',
      when: articlesLeft.length,
    })

    return cont ?
      throttleWithPrompt(articlesLeft) :
      true
  } catch (e) {
    console.log(e)
    return Promise.reject(e)
  }
}

getFeed()
  .then((res) => {
    throttleWithPrompt(res)
  })
