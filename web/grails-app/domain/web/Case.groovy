package web


/**
 *
 * Case is created by author and in the end it's send to government/city/district representative.
 *
 */
class Case {

    static constraints = {

        photo nullable: true
        description nullable: true

    }

    static embedded = ['photo','location']

    Photo photo

    String title
    String description

    Location location

    Author author

}
