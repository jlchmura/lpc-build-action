# lpc-build-action
LPC Build Action for Github

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
        uses: jlchmura/lpc-build-action@latest
        with:
          lpc-config: ${{ github.workspace }}/lpc-config.json        
```
