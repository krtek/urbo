package web

class Author {

    static hasMany = [feedback : Feedback]
    static embedded = ['email']

    static constraints = {
    }

    String name
    String surname

    Email email

    @Override
    String toString() {
        "${name} ${surname}"
    }
}
