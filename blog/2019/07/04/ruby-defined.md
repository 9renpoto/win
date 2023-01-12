---
title: 'defined? function'
date: '2019-07-04T11:00:00+09:00'
---

- `NoMethodError` を回避するのに存在を確認すればいいと思ったけれど、その時は
  `defined?` を別で使う必要がある
- いろいろな書き方があるのは難しい

```ruby
# NoMethodError
if a.b.preset?
  a.b(c)
end
```

```ruby
defined?(bacon)
# nil
```

- <https://www.rubyguides.com/2018/10/defined-keyword/>
