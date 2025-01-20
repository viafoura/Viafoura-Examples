#!/bin/sh

# dockerignore_test.sh

cat <<EOF > Dockerfile.build-context
FROM busybox
COPY . /build-context
WORKDIR /build-context
CMD find .
EOF

docker build -f Dockerfile.build-context -t build-context .
docker run --rm -it build-context

rm Dockerfile.build-context
