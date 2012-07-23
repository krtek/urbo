package web

class Photo {

    static constraints = {
    }

    static belongsTo = [feedback: Feedback]

    byte[] data
}
