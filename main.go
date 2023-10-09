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
	logrus.Infof("start 15!!")
	// must(os.Chdir("/"))
	logrus.Infof("just before Getwd, environment variable FOO is %s", os.Getenv("FOO"))
	logrus.Infof("just before Getwd, environment variable PWD is %s", os.Getenv("PWD"))
	logrus.Infof("just before Getwd, environment variable MYPWD is %s", os.Getenv("MYPWD"))
	pwd, err := os.Getwd()
	logrus.Infof("pwd: '%s'", pwd)
	must(err)
	// fs, err := os.ReadDir(".")
	// fs, err := os.ReadDir("/")
	fs, err := os.ReadDir(pwd)
	must(err)
	for _, f := range fs {
		logrus.Infof("f: %+v", f)
	}
	logrus.Infof("just before ReadFile, environment variable FOO is %s", os.Getenv("FOO"))
	logrus.Infof("just before ReadFile, environment variable PWD is %s", os.Getenv("PWD"))
	logrus.Infof("just before ReadFile, environment variable MYPWD is %s", os.Getenv("MYPWD"))
	b, err := os.ReadFile("dep.json")
	// b, err := os.ReadFile("/dep.json")
	// b, err := os.ReadFile("./dep.json")
	must(err)
	logrus.Infof("The contents are:\n%s", string(b))
	logrus.Infof("done")
}
