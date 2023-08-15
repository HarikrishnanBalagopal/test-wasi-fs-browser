package main

import (
	"os"

	"github.com/sirupsen/logrus"
)

func must(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	logrus.Infof("start")
	pwd, err := os.Getwd()
	logrus.Infof("pwd: '%s'", pwd)
	must(err)
	fs, err := os.ReadDir(".")
	must(err)
	for _, f := range fs {
		logrus.Infof("f: %+v", f)
	}
	b, err := os.ReadFile("./dep.json")
	must(err)
	logrus.Infof("The contents are:\n%s", string(b))
	logrus.Infof("done")
}
