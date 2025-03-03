import express = require('express');

declare module 'express' {
  interface Request {
    user?: string;  // or a more specific type
  }
}