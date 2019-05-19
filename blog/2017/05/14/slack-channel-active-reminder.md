---
date: '2017-05-14T22:39:17+09:00'
permalink: '/entry/2017/05/14/slack-channel-active-reminder/'
title: アクティブでなさそうなSlackチャンネルをArchiveお願いする
category: 'js'
---

# slack-channel-active-reminder

書いたもの： <https://github.com/9renpoto/slack-channel-active-reminder>

![image](/static/slack-channel-active-reminder.png)

slackの部屋は便利に増やしていけますが、
同じような部屋が散乱したり、入ってみたものの活動が薄かったり様々あるので
一定時間発言がない部屋に対してメッセージを送りつけるようなものを書いた。

## Usage

Cronなどと合わせて仕込んで良いタイミングで発言がなさそうなところに対してメッセージを送る。

```javascript
const CronJob = require('cron').CronJob
const Reminder = require('slack-channel-active-reminder').default

const reminder = new Reminder()

const job = new CronJob({
  cronTime: '0 00 18 * * 1-5',
  onTick: function() {
    reminder.postRemindMessage()
  },
  start: false,
  timeZone: 'Asia/Tokyo'
})
job.start()
```

中身は `@slack/client` を使っているだけ。
便利なAPIが多いと助かる。

## 追記

<https://github.com/9renpoto/slack-channel-active-reminder/pull/9>

`flow gen-flow-files` が良いものをだしてくれないため外す。
早く1.0が待ち遠しい。
