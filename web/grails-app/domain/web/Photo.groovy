package web

class Photo {

    static constraints = {
        data(maxSize: 5000000)
    }

    byte[] data
}
