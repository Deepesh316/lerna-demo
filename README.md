# lerna-demo

Learn how to create a mono repository

# install lerna

npm i -g lerna

# check version

lerna -v

# lerna doc

https://lerna.js.org/

# initialize lerna repository

lerna init

# link cross-dependencies

lerna bootstrap

# create new package (with scope)

lerna create <new package name (including scope)> eg: lerna create <package-name> <package-folder>

# display list of packages

lerna ls or lerna list

# add dependency to packages

lerna add <package-1> --scope=<package-2> ie; install <package-1> to <package-2>
