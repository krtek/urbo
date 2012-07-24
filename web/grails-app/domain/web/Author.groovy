package web

class Author {

    static hasMany = [feedback : Feedback]

    static embedded = ['email']

    static belongsTo = Feedback

    static constraints = {
    }

    String name
    String surname

    Email email
}
