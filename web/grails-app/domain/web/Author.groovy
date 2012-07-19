package web

class Author {

    static hasMany = [cases : Feedback]

    static embedded = ['email']

    static belongsTo = Feedback

    static constraints = {
    }

    String name
    String surname

    Email email
}
