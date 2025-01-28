.PHONY : amd64 amd64-local arm64 arm64-local clean all multi-arch run start

amd64 :
	@(docker buildx build --platform linux/amd64 --progress plain --sbom=true --provenance=true --pull -t notification-stream:amd64-latest .)

amd64-local :
	@(docker buildx build --platform linux/amd64 --progress plain --sbom=true --provenance=true --pull -f Dockerfile.local -t notification-stream:amd64-local-latest .)

arm64 :
	@(docker buildx build --platform linux/arm64 --progress plain --sbom=true --provenance=true --pull -t notification-stream:arm64-latest .)

arm64-local :
	@(docker buildx build --platform linux/arm64 --progress plain --sbom=true --provenance=true --pull -f Dockerfile.local -t notification-stream:arm64-local-latest .)

multi-arch :
	@(docker buildx build --platform "linux/amd64,linux/arm64" --progress plain --sbom=true --provenance=true --pull --rm -t notification-stream:muilti-arch-latest .)

clean :
	@(docker rmi -f notification-stream:amd64-latest 2> /dev/null) |:
	@(docker rmi -f notification-stream:arm64-latest 2> /dev/null) |:

run :
	@(npm run start)

start : run

all : amd64 arm64
