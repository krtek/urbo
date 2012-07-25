package web

class Location {

    Double latitude
    Double longitude

    static belongsTo = [feedback: Feedback]

    @Override
    String toString() {
        "${latitude}, ${longitude}"
    }
}
