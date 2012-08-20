# Urbo mobile applications
## HOWTO init development
There are submodules in **Urbo** source code, so simple `git clone` is not enough.
To clone repository:

	git clone git://github.com/krtek/urbo.git urbo-mobile
	git submodule init
	git submodule update
        git pull --recurse-submodules
        git submodule update --recursive

