# SCIP Installation

-   Download the `tar.gz` from [...]
-   Extract

```
$ tar -xvzf [...]
```

-   Go to the extracted directory
-

```
mkdir build
cd build
cmake ..
make
make libscip
make check
make install
```

## To install PySCIPOpt

-   Install using `PyPY`, not conda. Conda would download it's own suite and might mess everything up

```
$ pip install pyscipopt
```

-   Try from a Python interactive shell

```
> import pyscipopt
```

If this shows the error

```
ImportError: libscip.so.8.0: cannot open shared object file: No such file or directory
```

Then you need to check if the libraries compiles with `make libscip` are properly installed: make sure they are available in a directory as `/usr/local/lib/`, and if so then run `ldconfig` after adding that directory to the `/etc/ld.so.conf.d/<something>.conf` file

After this, you can check if the linker will detect the installed libs:

```
$ ldconfig -p | grep scip
        libscip.so.8.0 (libc6,x86-64) => /usr/local/lib/libscip.so.8.0
        libscip.so (libc6,x86-64) => /usr/local/lib/libscip.so
```

Also, to test the `PySCIPOpt` installation on your local machine you can run:

```
$ python local_scip_test.py
feasible solution found by trivial heuristic after 0.0 seconds, objective value 0.000000e+00
presolving:
presolving (1 rounds: 1 fast, 0 medium, 0 exhaustive):
 1 deleted vars, 0 deleted constraints, 0 added constraints, 0 tightened bounds, 0 added holes, 0 changed sides, 0 changed coefficients
 0 implications, 0 cliques
transformed 2/2 original solutions to the transformed problem space
Presolving Time: 0.00

SCIP Status        : problem is solved [optimal solution found]
Solving Time (sec) : 0.00
Solving Nodes      : 0
Primal Bound       : +0.00000000000000e+00 (2 solutions)
Dual Bound         : +0.00000000000000e+00
Gap                : 0.00 %
x: 0.0
y: -0.0

```
