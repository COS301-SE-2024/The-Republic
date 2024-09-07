# nginx-docker-compose

Example for a blog post about nginx docker compose

## Basic example

In the basic example, you will host static files with Nginx. The docker compose config is
defined in the `basic.yaml` file.

To run this you will execute:

```bash
docker compose -f basic.yaml up
```

Once the container is up and running, you can hit `http://localhost:8089` to see a sample website for an imaginary Gen AI startup called `Smmrzer` that summarizes text :). The template used is called [Stellar](https://html5up.net/stellar) by [HTML5up](https://html5up.net).

It will look something like the below:
