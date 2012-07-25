package web

class Photo {

    static belongsTo = [feedback: Feedback]

    static constraints = {
        data(maxSize: 5000000)
    }

    byte[] data
}
