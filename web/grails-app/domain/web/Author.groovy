package web

class Author {

    static hasMany = [cases : Case]

    static embedded = ['email']

    static belongsTo = Case

    static constraints = {
    }

    String name
    String surname

    Email email
}
