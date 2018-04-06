# Draft Packs for Brigade

This project contains Draft packs oriented toward Brigade.

Available Packs:

- brigade-gateway: Quickly create a new Brigade gateway using a base Node.js project.

## Installation

Add this GitHub repo as a pack repository:

```console
$ draft pack-repo add https://github.com/technosophos/draft-brigade
```

## Brigade-Gateway

To begin using Brigade gateway scaffold, simply do this:

```console
$ mkdir myGateway
$ cd myGateway
$ draft create --pack brigade-gateway
$ # Edit index.js
```

The `index.js` file is pre-configured for rapidly creating an HTTP/HTTPS Brigade gateway. Inside of the `index.js` file, you will find instructions for modifying it to suit your needs.
