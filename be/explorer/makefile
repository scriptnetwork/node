SYSDIR=../..
DOTOOL_ss=be/explorer
# Isolated mode values:
DOTOOL_ss_network=testnet
DOTOOL_ss_instance=genesis
DOTOOL_m=m1
# Isolated/Managed modes 
DOTOOL_CACHE__DEBUG=~/.dotool/cache/debug/${DOTOOL_ss}
DOTOOL_CACHE__RELEASE=~/.dotool/cache/release/${DOTOOL_ss}
DOTOOL_DIR=.
DOTOOL_FILE=${DOTOOL_DIR}/dotool.js

# ------------------ dotool targets

all: install

dotool: ${DOTOOL_FILE}
	@echo ${DOTOOL_FILE}
	@echo ./config.cfg

install: dotool
	bin/build_install

${DOTOOL_FILE}:
	${SYSDIR}/bin/mk_dotool ${DOTOOL_ss} ${DOTOOL_ss_network} ${DOTOOL_ss_instance} ${DOTOOL_m} ${DOTOOL_FILE}

clean:
	$(RM) -r node_modules
	$(RM) -r _doc_rpc
	$(RM) -r log

clean_cache: clean
	$(RM) -r ${DOTOOL_CACHE__DEBUG}
	$(RM) -r ${DOTOOL_CACHE__RELEASE}

clean_deep: clean
	$(RM) ${DOTOOL_FILE}
	$(RM) config.cfg

.PHONY: all install dotool clean clean_cache clean_deep

# -/---------------- dotool targets

dev:
	npm run start

doc_rpc:
	npm run doc_rpc


.PHONY: dev doc_rpc

