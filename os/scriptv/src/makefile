STDFLAGS:=-std=c++20 -Wno-psabi
PREFIX:=/usr/local
DEBUGFLAGS:=-g -O0 ${STDFLAGS} -DDEBUG
RELEASEFLAGS:=-O3 ${STDFLAGS} -DNDEBUG
SCRIPTV:=scriptv
LIBSCRIPTV:=libscriptv
BCFG:=scriptv
DEFAULTDEBUG:=1
CXXFLAGS:=${DEBUGFLAGS}
US:=scriptv

ifeq ($(CXX),)
  CXX:=g++
endif

ifeq (${DEFAULTDEBUG},1)
    all: export CXXFLAGS:=${DEBUGFLAGS}
else
    all: export CXXFLAGS:=${RELEASEFLAGS}
endif
all: targets

debug: export CXXFLAGS:=${DEBUGFLAGS}
debug: targets

release: export CXXFLAGS:=${RELEASEFLAGS}
release: targets

warndistr:
	@if [ -f /var/us_nets ]; then grep " ${US} " /var/us_nets > /dev/null || echo "V0FSTklORzogVGhpcyBicmFuZCBkb2VzIG5vdCBtYXRjaCB0aGUgaW5zdGFsbGVkIGJyYW5kIGF0IC92YXIvdXNfbmV0cy4K" | base64 -d; fi

targets: warndistr cli/${SCRIPTV}
	@echo "cli/${SCRIPTV}"

.ONESHELL:

scriptv/${LIBSCRIPTV}.so:
	$(MAKE) CXXFLAGS="${CXXFLAGS}" -C scriptv

cli/${SCRIPTV}: scriptv/${LIBSCRIPTV}.so
	$(MAKE) CXXFLAGS="${CXXFLAGS}" -C cli

clean:
	$(MAKE) -C scriptv clean
	$(MAKE) -C cli clean

.PHONY: all scriptv debug release targets clean warndistr

