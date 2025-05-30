LIBSO:=libscriptv
CXXFLAGS=-O0 -g -std=c++20 -DDEBUG -Wno-psabi
CPPS:=$(wildcard *.cpp)
HS:=$(wildcard *.h)
OS:=$(shell uname)
ifeq (${OS},Linux)
    ARCH:=$(shell uname -m)
else
    ifeq (${OS},FreeBSD)
      ARCH:=$(shell uname -p)
    endif
endif
ifeq (${OS},Linux)
    EC:=$(shell pkg-config --libs libsecp256k1)
    LIBCRYPTO:=$(shell pkg-config --libs libcrypto++)
else
    ifeq (${OS},FreeBSD)
        EC:=$(shell PKG_CONFIG_PATH=/usr/local/lib/pkgconfig pkg-config --libs libsecp256k1)
        LIBCRYPTO:=-L/usr/local/lib -lcryptopp
    endif
endif

OBJS:=$(CPPS:.cpp=.o)
DOBJS:=io/io.o
DOBJS+=crypto/crypto.o
DOBJS+=cli/cli.o
DOBJS+=log/log.o

INC:=-I.. -I/usr/local/include

LIB:=${EC} ${LIBCRYPTO} #-lb64
#ifeq (${CXX},g++)
#    LIB+=-lstdc++fs
#endif
LIB+=-pthread

ifeq (${ARCH},armv7l)
    LIB+=-latomic
endif

RPATH:=-Wl,-z,defs

all: ${LIBSO}.so

%.o: %.cpp
	$(CXX) -fPIC -c ${CXXFLAGS} ${INC} $^ -o $@

subojs:
	@for a in $$(ls); do \
	if [ -f $$a/makefile ]; then \
	echo "==============directory gov/$$a"; \
	$(MAKE) -C $$a; \
	fi; \
	done;

${LIBSO}.so: subojs ${OBJS}
	@echo ""
	@echo "[--->Link shared library: ${LIB}.so]"
	$(CXX) -fPIC -shared ${CXXFLAGS} ${RPATH} ${OBJS} ${DOBJS} ${LIB} -o ${LIBSO}.so
	@echo ""

clean:
	@for a in $$(ls); do \
	if [ -d $$a ]; then \
	    $(MAKE) -C $$a clean; \
	fi; \
	done;
	$(RM) *.o
	$(RM) ${LIBSO}.so

.PHONY: all subojs clean

