# orsc: Operations Research Scaffold

A set of libraries and tools to speed-up Optimization engagements

## Environment configuration

If you have `pyenv` and `pyenv-virtualenv` configured on a mac or linux system:
```
$ pyenv virtualenv 3.10.7 orsc-3.10.7
$ echo orsc-3.10.7 > .python-version
$ pip install requirements.txt
```

You can also install a jupyter kernel by running from the actvated `pyenv virtualenv`
```
$ python -m ipykernel install --user --name orsc-3.10.7-kernel --display-name "Python (orsc-3-10-7-kernel)"
```
Then running
```
$ jupyter lab
```
should trigger a jupyter lab and you should be able to select the right `ipykernel`.
## Code style
Use `pylint` and `black`
