
## problem
* [warn] epoll_create: Too many open files
* [err] evsignal_init: socketpair: Too many open files


## Commands

```bash
#get list of network connections
lsof -i -n -P | grep node | wc -l
```