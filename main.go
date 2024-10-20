package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

var (
	ctx    = context.Background()
	client = redis.NewClient(&redis.Options{
		Addr: "redis:6379",
	})
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := filepath.Join(h.staticPath, r.URL.Path)

	fi, err := os.Stat(path)
	if os.IsNotExist(err) || fi.IsDir() {
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/ws/{channel}", handleWebSocket)
	spa := spaHandler{staticPath: "frontend/dist", indexPath: "index.html"}
	r.PathPrefix("/").Handler(spa)

	log.Println("Listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", r))

	//var dir string
	//flag.StringVar(&dir, "frontend/dist", ".", "the directory to serve files from")
	//flag.Parse()
	//log.Println(dir)
	//r.PathPrefix("/").Handler(http.FileServer(http.Dir(dir)))
	//fs := http.FileServer(http.Dir("./web"))
	//r.PathPrefix("/").Handler(fs)

	//e := echo.New()
	//frontend.RegisterHandlers(e)
	//e.GET("/api", func(c echo.Context) error {
	//	return c.String(http.StatusOK, "Hello, World!")
	//})
	//e.Logger.Fatal(e.Start(":8080"))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	channel := vars["channel"]
	log.Println("reacherd here")
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	sub := client.Subscribe(ctx, channel)
	defer sub.Close()

	ch := sub.Channel()

	go func() {
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("Read error:", err)
				return
			}
			if err := client.Publish(ctx, channel, string(message)).Err(); err != nil {
				log.Println("Publish Error:", err)
				return
			}
		}
	}()
	for msg := range ch {
		if err := conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload)); err != nil {
			log.Println("Write error:", err)
			return
		}
	}
}
