SCRIPTV:=scriptv
CXXFLAGS = -g -O0 -std=c++20 -DDEBUG
CPPS:=$(wildcard *.cpp)
OBJS:=$(CPPS:.cpp=.o)
HS:=$(wildcard *.h)
OS:=$(shell uname)
ifeq (${OS},Linux)
    ARCH:=$(shell uname -m)
else
    ifeq (${OS},FreeBSD)
      ARCH:=$(shell uname -p)
    endif
endif

INC:=-I.. -I/usr/local/include

LIB:=-L../scriptv -l${SCRIPTV}
ifeq ($(ARCH),armv7l)
    LIB+=-latomic
endif
LIB+=-pthread

ifneq (,$(findstring -g,${CXXFLAGS}))
    RPATH:=-Wl,-rpath,../scriptv:scriptv/:lib/
else
    RPATH:=
endif

all: ${SCRIPTV}

info:
	@echo "rpath ${RPATH}"

${SCRIPTV}: ${OBJS}
	@echo ""
	@echo "[--->Link executable: ${SCRIPTV}]"
	$(CXX) ${CXXFLAGS} ${RPATH} ${OBJS} ${LIB} -o ${SCRIPTV}
	@echo ""

%.o: %.cpp
	$(CXX) -fPIC -c ${CXXFLAGS} ${INC} $^ -o $@

clean:
	$(RM) ${SCRIPTV}
	$(RM) *.o

.PHONY: all clean info
