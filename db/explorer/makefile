SYSDIR=../..
DOTOOL_ss=db/explorer
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

install: dotool
	bin/build_install

${DOTOOL_FILE}:
	${SYSDIR}/bin/mk_dotool ${DOTOOL_ss} ${DOTOOL_ss_network} ${DOTOOL_ss_instance} ${DOTOOL_m} ${DOTOOL_FILE}

clean:
	$(RM) -r node_modules

clean_cache: clean
	$(RM) -r ${DOTOOL_CACHE__DEBUG}
	$(RM) -r ${DOTOOL_CACHE__RELEASE}

clean_deep: clean
	$(RM) ${DOTOOL_FILE}

.PHONY: all install dotool clean clean_cache clean_deep


