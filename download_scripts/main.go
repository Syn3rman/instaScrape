package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"runtime"
	"strings"
	"sync"
	"time"
)

func check(err error){
	if err != nil{
		panic(err)
	}
}

func fetchImage(url string, i int,guard chan struct{}, wg *sync.WaitGroup){
	// fmt.Printf("Routine %v started \n", i)
	defer wg.Done()
	resp, err := http.Get(url)
	check(err)
	defer resp.Body.Close()
	temp := strings.Split(url, "/")
	filename := strings.Split(temp[len(temp)-1], "?")[0]
	file, err := os.Create(filename)
	check(err)
	io.Copy(file, resp.Body)
	file.Close()
	// fmt.Printf("Routine %v ended", i)
	<-guard
}

func main(){
	runtime.GOMAXPROCS(runtime.NumCPU())
	path, err := os.Getwd()
	check(err)
	path += "/urls.txt"
	maxGoroutines := 1000
	guard := make(chan struct{}, maxGoroutines)

	start := time.Now()
	
	data, err := ioutil.ReadFile(path)
	urls := strings.Split(string(data), "\n")
	urls = urls[:len(urls)-1]
	var wg sync.WaitGroup
	for ind, url := range(urls){
		wg.Add(1)
		guard <- struct{}{}
		go fetchImage(url, ind, guard, &wg)
	}
	wg.Wait()

	fmt.Printf("Completed in %v\n", time.Since(start))
}