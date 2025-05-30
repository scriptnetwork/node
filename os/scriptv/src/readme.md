# scriptv - Intro

This codebase provides low-level functions servicing a web3 stack.
Assets:

## libscriptv.so

A shared library providing:
  * cryptographic functions: hashing, ECDSA, AES encryption. 
  * PKI
  * base58 and hex encoder/decoder
  * hmi interface

## scriptv
  * CLI interface


# Build:

## make using 20 parallel jobs
```
make -j20
```

## invoke
```
manic_beret@starchip:~/dev/system/b416/os/scriptv/scriptv$ scriptv/scriptv -h
scriptv. Copyright (C) Copyright line
    Copyright line 1
    Copyright line 2
    version: scriptv-alpha-57_d30c99+.184440 d30c990831d159fdb6fd5f62c9384bcdd30c5dd2+ 2025-02-22_20-50-49
    Build configuration: [with logs] [logdir ./logs] [debug build] 
    Parameters:
        home: /home/manic_beret/.scriptv
        warning: this is a debug build.
        warning: logs are ON. Writing files in ./logs
Usage: scriptv-wallet [options] [command]
Options:
    General parameters:                                                               .                                                                               
        -home <homedir>                                                                   homedir. [/home/manic_beret/.scriptv]                                           
        -log                                                                              Logs in screen..                                                                
        -logd <dir>                                                                       Directory for writting log files..                                              
        -nolog                                                                            Disable logs..                                                                  
        -n                                                                                Omit field names in output. [true]                                              
        -nb                                                                               Don't show the banner..                                                         

Commands:
    misc:                                                                             ----------.                                                                     
        version                                                                           Print software version..                                                        

    keys:                                                                             ----------.                                                                     
        b58 <cmd>                                                                         Base58 Functions..                                                              
            encode/decode <filename>                                                      B58 Encode the content of the given filename..                                  
            encode/decode -                                                               B58 Encode the input captured from cin (pipes)..                                
            encode/decode -l "msg"                                                        B58 Encode the next argument..                                                  
        hex <cmd>                                                                         Hex Functions..                                                                 
            encode/decode <filename>                                                      Hex Encode the content of the given filename..                                  
            encode/decode -                                                               Hex Encode the input captured from cin (pipes)..                                
            encode/decode -l "msg"                                                        Hex Encode the next argument..                                                  
        ec <cmd>                                                                          Sign and Verify using EC secp256k1..                                            
            gen_keys                                                                      Generate private key and print it along with public key and address.            
            sign <message_b58> <private_key>                                              Sign message.                                                                   
            verify <message_b58> <signature> <public_key>                                 Verify signed message.                                                          
            priv_key <private_key_b58>                                                    calculates addresses and public keys.                                           
            priv_key_hex <private_key_hex>                                                calculates addresses and public keys.                                           

    Software:                                                                         ----------.                                                                     
        version                                                                           Print version..                                                                 
        h|-h|help|-help|--help                                                            This help screen.                                                               


```

# filesystem

| **Path**          | **Description**                                    |
|-------------------|----------------------------------------------------|
| `.`               | The codebase. (see `src/readme.md` file)          |
| `scriptv/`         | Shared library sources                          |
| `cli/`             | CLI program sources                             |
| `cli/scriptv`     | The program output (executable)                   |


