package web

class Email {

    static constraints = {
    }

    String address // eg. michal@bernhard.cz
    @Override
    String toString() {
        "${address}"
    }
}
