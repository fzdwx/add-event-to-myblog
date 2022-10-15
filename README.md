# add event to my blog

主要为了个人的[blog](https://github.com/fzdwx/fzdwx.github.io)提供一些issue方面的自动化支持:

1. 将每个issue当做一片简短的小记部署到blog上

## usage

在`.github/workflows/`下新建一个yml

```yaml
name: add event

on:
  issues

jobs:
  add:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v3
      - name: add event to my blog
        uses: fzdwx/add-event-to-myblog@xxx
        with:
          token: ${{ secrets.TOKEN }}
          issueNumber: ${{ github.event.issue.number }}
```