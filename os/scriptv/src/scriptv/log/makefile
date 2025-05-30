OBJ:=log
CXXFLAGS=-O0 -g -std=c++20 -DDEBUG
CPPS:=$(wildcard *.cpp)
OBJS:=$(patsubst %.cpp, %.o, $(CPPS))
HS:=$(wildcard *.h)
INC:=-I../.. -I/usr/local/include

all: ${OBJ}.o

%.o: %.cpp
	$(CXX) -fPIC -c ${CXXFLAGS} ${INC} $^ -o $@

${OBJ}.o: ${OBJS}
	ld -r ${OBJS} -o ${OBJ}.o

clean:
	$(RM) -f *.o

.PHONY: clean all

