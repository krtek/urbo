class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

        "/admin/case"(controller: "caseCrud")
        "/admin/author"(controller:  "authorCrud")

        "/api/v1/case"(controller: "case", action: "findAll")
        "/api/v1/case/$id"(controller: "case", action: "findById")

        "/api/v1/"(controller: "apiHelp")

		"/"(view:"/index")
		"500"(view:'/error')
	}
}
