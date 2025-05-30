all: _targets/conf_hash

_targets/conf_hash:
	@dotool__build

deploy: _targets/conf_hash
	dotool__deploy _targets

deploy_dryrun: _targets/conf_hash
	dotool_deploy --dryrun _targets

deploy_notest: _targets/conf_hash
	dotool__deploy --omit-test _targets

deploy_notest_dryrun: _targets/conf_hash
	dotool__deploy --omit-test --dry_run _targets

install: deploy

check: clean
	>&2 >/dev/null make

clear_cache:
	@dotool --debug clear_cache all --release clear_cache all

clean_cache: clear_cache

clean: clean_common
	dotool__clean
	$(RM) -r node_modules

clean_all: clean_common
	dotool__clean all

clean_common:
	@$(RM) -r _targets

.PHONY: all clean build deploy deploy_dryrun deploy_notest build_deploy clear_cache clean_cache clean_all clean_common _targets/conf_hash
