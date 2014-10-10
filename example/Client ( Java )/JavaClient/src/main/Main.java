package main;

import java.net.URISyntaxException;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;

public class Main {

	public Main() {
		
		
	}

	public static void main(String[] args) {
		
		
		 try {
		        final com.github.nkzawa.socketio.client.Socket socket = IO.socket("http://nightout-app.herokuapp.com/");

		        socket.on(com.github.nkzawa.socketio.client.Socket.EVENT_CONNECT, new Emitter.Listener() {

		            @Override
		            public void call(Object... args) {
		                socket.emit("chat message", "hi");
		               //socket.disconnect();
		            }

		        }).on("event", new Emitter.Listener() {

		            @Override
		            public void call(Object... args) {
		            }

		        }).on(com.github.nkzawa.socketio.client.Socket.EVENT_DISCONNECT, new Emitter.Listener() {

		            @Override
		            public void call(Object... args) {
		            }

		        });
		        
		        socket.on("chat message", new Emitter.Listener() {
		        	  @Override
		        	  public void call(Object... args) {
		        	    System.out.println( args[0]);
		        	  }
		        	});
		        
		        socket.connect();
		    } catch (URISyntaxException e) {
		        e.printStackTrace();
		    }
	}

}
