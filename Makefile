.PHONY: deploy
deploy:
	npm run compile
	AWS_PROFILE=restyled sam deploy \
	  --stack-name wip-irc-as-slack \
	  --s3-bucket infra.restyled.io \
	  --s3-prefix /src/irc-as-slack/wip \
	  --debug
