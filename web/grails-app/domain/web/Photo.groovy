package web

class Photo {

    static belongsTo = [feedback: Feedback]

    static constraints = {
    }

    byte[] data
}
