package web

class Location {

    Double latitude
    Double longitude

    @Override
    String toString() {
        "${latitude}, ${longitude}"
    }
}
