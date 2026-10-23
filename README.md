# cloudshell
Dotfiles for cloudshell

```
TMP=$(mktemp -d) && git clone https://github.com/oktvn/cloudshell.git "$TMP" && cp -a "$TMP"/. "$HOME/" && rm -rf "$TMP" && chmod +x $HOME/gopath/bin/*
```