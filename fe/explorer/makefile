SYSDIR=../..
DOTOOL_ss=fe/explorer
# Isolated mode values:
DOTOOL_ss_network=testnet
DOTOOL_ss_instance=genesis
DOTOOL_m=m1
# Isolated/Managed modes 
DOTOOL_CACHE__DEBUG=~/.dotool/cache/debug/${DOTOOL_ss}
DOTOOL_CACHE__RELEASE=~/.dotool/cache/release/${DOTOOL_ss}
DOTOOL_DIR=dotool
DOTOOL_FILE=${DOTOOL_DIR}/index.js

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
	$(RM) -r public/css
	$(RM) -r public/js

clean_cache: clean
	$(RM) -r ${DOTOOL_CACHE__DEBUG}
	$(RM) -r ${DOTOOL_CACHE__RELEASE}

clean_deep: clean
	$(RM) -r ${DOTOOL_DIR}

.PHONY: all install dotool clean clean_cache clean_deep

# -/---------------- dotool targets

dev:
	npm run dev

setup:
	npm install --legacy-peer-deps

build: setup
	npm run build

.PHONY: dev setup build

