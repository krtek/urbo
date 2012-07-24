package web

class Email {
    static belongsTo = [author: Author]

    static constraints = {
    }

    String address // eg. michal@bernhard.cz
    @Override
    String toString() {
        "${address}"
    }
}
