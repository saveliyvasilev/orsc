# This is meant to be executed as a script, not as a python module
# $ python main.py
# Keep this structure to avoid any relative import issues away with local and docker runs :)

from blending.main import run


if __name__ == "__main__":
    run()
