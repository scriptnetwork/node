# os/scriptv SS

Subsystem with dotool interface encapsulating a library

## makefile

### Build. Subsystem in isolation (from this os/scriptv directory):

```
make 
```

Output files written at `_output`

## Invoke tests
```
manic_beret@starchip:~/dev/system/b416/os/scriptv$ bin/test_scriptv 
Running tests for scriptv...
OK scriptv binary found
OK b58 encoding/decoding works
OK b58 encoding/decoding via pipe works
OK hex encoding/decoding works
OK hex encoding/decoding via pipe works
OK EC signing and verification works
OK EC private key calculation works
OK ALL TESTS PASSED SUCCESSFULLY

```

## Clean
```
make clean
```

# filesystem

| **Path**          | **Description**                                    |
|-------------------|----------------------------------------------------|
| `.`               | Subsystem - DevOps                                |
| `bin/`             | Dotool programs                                  |
| `lib/`             | Dotool libraries                                 |
| `src/`             | The codebase. (see `src/readme.md` file)          |
| `src/scriptv/`     | Shared library sources                          |
| `src/cli/`         | CLI program sources                             |
| `src/cli/scriptv` | The program output (executable)                   |



