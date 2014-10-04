package com.example.test;

import java.net.URISyntaxException;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;


public class MainActivity extends ActionBarActivity {
	public static final String TAG = "NIGHTOUT";
	private com.github.nkzawa.socketio.client.Socket socket;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
    	
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.i(TAG, "App started");

		 try {
			 socket = IO.socket("http://nightout-app.herokuapp.com/");

		        socket.on(com.github.nkzawa.socketio.client.Socket.EVENT_CONNECT, new Emitter.Listener() {

		            @Override
		            public void call(Object... args) {
		                socket.emit("chat message", "hi new android client connected");
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
		        
		  
		        
		        socket.connect();
		    } catch (URISyntaxException e) {
		        e.printStackTrace();
		    }
		 
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        
        final EditText editText = (EditText) findViewById(R.id.send);
        editText.setOnEditorActionListener(new OnEditorActionListener() {

			@Override
			public boolean onEditorAction(TextView v, int actionId,
					KeyEvent event) {
                boolean handled = false;
                if (actionId == EditorInfo.IME_ACTION_SEND) {
                	socket.emit("chat message", editText.getText());
                	editText.setText("");
                	handled = true;
                }
                return handled;
			}
        });
        
        final LinearLayout messages = (LinearLayout) findViewById(R.id.messages);

        
        socket.on("chat message", new Emitter.Listener() {
      	  @Override
      	  public void call(Object... args) {
      		  		
	        	    
	        	    final String newMessage = (String) args[0];
	        	    System.out.println(newMessage);

	        	    runOnUiThread(new Runnable() {
	        	        @Override
	        	        public void run() {

	        	     TextView rowTextView = new TextView(getApplicationContext());
	        	     rowTextView.setText((CharSequence) newMessage);
	        	     messages.addView(rowTextView);
	        	    
	        	        }
	        	    });

      	  }
      	});
        
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
