# lpc-build-action
LPC Build Action for Github

Parses and type checks your LPC code using the [LPC Language Server](https://github.com/jlchmura/lpc-language-server) compiler API.

Sample action yaml:

```yml
jobs:
  lpc_build:
    runs-on: ubuntu-latest
    name: Build LPC Code
    steps:
      - name: Checkout repository
        uses: actions/checkout@master
        
      - name: Build
        id: build
        uses: jlchmura/lpc-build-action@main
        with:
          lpc-config: ${{ github.workspace }}/lpc-config.json        
```
